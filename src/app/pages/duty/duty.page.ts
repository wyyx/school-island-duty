import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { AlertController, IonSelect, ActionSheetController } from '@ionic/angular'
import { BehaviorSubject, from, Observable, of } from 'rxjs'
import { switchMap, take } from 'rxjs/operators'
import { listAnim } from 'src/app/animations/list.anim'
import { SelectScoreModalComponent } from 'src/app/components/select-score-modal/select-score-modal.component'
import { WeekHistoryModalComponent } from 'src/app/components/week-history-modal/week-history-modal.component'
// import { dbService } from 'src/app/mocks/db.mock.service'
import {
  AClass,
  CheckItem,
  CheckSubItem,
  DeductionPost,
  Grade,
  SubItemScoreHistory
} from 'src/app/models/duty-db.model'
import { ModalService } from 'src/app/services/modal.service'
import { PopoverService } from 'src/app/services/popover.service'
import { ToastService } from 'src/app/services/toast.service'
import { dbService } from 'src/app/storage/db.service'
import { convertToArray } from 'src/app/utils/sql.util'
import { slideScaleAnim } from 'src/app/animations/slide-scale.anim'
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx'
import { File } from '@ionic-native/file/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx'
import { LoadingService } from 'src/app/services/loading.service'

const SIZE_PRE_SLIDE = 5

declare var cordova: any

@Component({
  selector: 'app-duty',
  templateUrl: './duty.page.html',
  styleUrls: ['./duty.page.scss'],
  animations: [listAnim, slideScaleAnim]
})
export class DutyPage implements OnInit, AfterViewInit {
  @ViewChild('gradeSelect') gradeSelect: IonSelect

  grades: Grade[] = []
  currentGrade: Grade = {} as Grade
  currentClass: AClass = {} as AClass

  checkItems: CheckItem[] = []
  currentClassSubject$ = new BehaviorSubject<AClass>(null)
  currentClass$ = this.currentClassSubject$.asObservable()

  subItemScoreHistoryList$: Observable<SubItemScoreHistory[]>
  subItemScoreHistoryList: SubItemScoreHistory[] = []

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  }

  imageViewerslideOpts = {
    initialSlide: 0,
    speed: 400
  }

  slideImgs: string[] = []
  showImgViewer = false

  get currentClassFullName() {
    return this.currentGrade.grade && this.currentClass.name
      ? this.currentGrade.grade + this.currentClass.name
      : '未选班级'
  }

  constructor(
    private popoverService: PopoverService,
    private toastService: ToastService,
    private modalService: ModalService,
    private alertCtrl: AlertController,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    public file: File,
    public filePath: FilePath,
    private transfer: FileTransfer,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadGrades()
    this.loadCheckItems()

    this.subItemScoreHistoryList$ = this.currentClass$.pipe(
      switchMap(aclass => {
        return aclass ? from(dbService.subItemScoreHistory(aclass.class_id)) : of([])
      })
    )

    this.subItemScoreHistoryList$.subscribe(list => {
      this.subItemScoreHistoryList = list
      console.log(this.subItemScoreHistoryList)
    })
  }

  openImgViewer(imgs: string[]) {
    this.slideImgs = imgs
    this.showImgViewer = true
  }

  tapSlideImg() {
    this.showImgViewer = false
  }

  loadSubItemScoreHistory() {
    this.subItemScoreHistoryList$.pipe(take(1)).subscribe(list => {
      this.subItemScoreHistoryList = list
      console.log(this.subItemScoreHistoryList)
    })
  }

  ngAfterViewInit(): void {}

  getSubItemScoreHistory(subItem: CheckSubItem) {
    const subItemScoreHistoryList = this.subItemScoreHistoryList.filter(
      scoreItem => scoreItem.check_sub_id === subItem.duty_check_sub_item_config_id
    )[0]

    return subItemScoreHistoryList ? subItemScoreHistoryList.deductionArr : []
  }

  openSelectGrade(event) {
    this.gradeSelect.open(event)
  }

  onGradeChange(event) {
    this.currentClass = this.currentGrade.classList && this.currentGrade.classList[0]
    this.currentClassSubject$.next(this.currentClass)
  }

  openWeekHistoryModal(subItem: CheckSubItem) {
    const subItemScoreHistory = this.subItemScoreHistoryList.filter(
      e => e.check_sub_id === subItem.duty_check_sub_item_config_id
    )[0]

    this.modalService.openModal({
      component: WeekHistoryModalComponent,
      componentProps: {
        subItemScoreHistory: subItemScoreHistory.deductionArr
          ? subItemScoreHistory.deductionArr
          : []
      }
    })
  }

  loadGrades() {
    const loadingPromise = this.loadingService.openLoading({
      message: '正在加载数据...'
    })

    dbService
      .gradeList()
      .then(convertToArray)
      .then(gradeList => {
        gradeList.forEach(grade => {
          dbService
            .classesList(grade.grade)
            .then(convertToArray)
            .then(classList => {
              this.grades.push({ ...grade, classList })

              this.setInitData()
            })
        })

        loadingPromise.then(loading => {
          loading.dismiss()
        })
      })
  }

  setClass(aclass: AClass) {
    this.currentClass = aclass
    this.currentClassSubject$.next(this.currentClass)
  }

  setInitData() {
    this.setInitGrade()
    this.setInitClass()
  }

  setInitGrade() {
    const firstGrade = this.grades[0]

    if (firstGrade) {
      this.currentGrade = firstGrade
    }
  }

  setInitClass() {
    if (
      this.currentGrade &&
      this.currentGrade.classList &&
      this.currentGrade.classList.length > 0
    ) {
      this.currentClass = this.currentGrade.classList[0]
      this.currentClassSubject$.next(this.currentClass)
    }
  }

  openSelectScorePopover(subItem: CheckSubItem) {
    const popover = this.popoverService
      .openPopover({
        component: SelectScoreModalComponent,
        cssClass: 'select-score-popover',
        backdropDismiss: false
      })
      .then(res => {
        return res.onDidDismiss()
      })
      .then(detail => {
        const score = detail.data

        // modify score
        if (score && score !== 0) {
          subItem.scoreChange = score
        }
      })
  }
  showActionSheet(subItem: CheckSubItem) {
    this.presentActionSheet(subItem)
  }

  async presentActionSheet(subItem: CheckSubItem) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: '拍照',
          icon: 'camera',
          handler: () => {
            console.log('from camera')
            this.takePicture(this.camera.PictureSourceType.CAMERA, subItem)
          }
        },
        {
          text: '取消',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel')
          }
        }
      ]
    })
    await actionSheet.present()
  }

  takePicture(sourceType: PictureSourceType, subItem: CheckSubItem) {
    const options: CameraOptions = {
      quality: 5,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true
    }

    this.camera.getPicture(options).then(
      imagePath => {
        console.log('TCL: ChangeAvatarPage -> takePicture -> imagePath', imagePath)
        const imageSrc = (window as any).Ionic.WebView.convertFileSrc(imagePath)
        console.log('TCL: DutyPage -> takePicture -> imageSrc', imageSrc)

        subItem.addressList.push(imageSrc)
      },
      err => {
        console.log('TCL: ChangeAvatarPage -> takePicture -> err', err)
        this.toastService.showToast({
          message: '选择图片出现错误，请在 App 中操作或检查相关权限。',
          duration: 3000,
          showCloseButton: true,
          closeButtonText: '关闭'
        })
      }
    )
  }

  submit(item: CheckItem, subItem: CheckSubItem) {
    console.log('TCL: DutyPage -> submit -> subItem', subItem)
    const data: DeductionPost = {
      autograph: '',
      checkSub: [
        {
          addressList: subItem.addressList.map(src => {
            return {
              type: 1,
              media_address: src
            }
          }),
          change_score: -subItem.scoreChange,
          check_sub_id: subItem.duty_check_sub_item_config_id,
          check_sub_name: subItem.name,
          is_media: 1
        }
      ],
      check_id: item.duty_check_item_config_id,
      check_name: item.check_name,
      class_id: this.currentClass.class_id
    }

    dbService
      .saveScore(data)
      .then(() => {
        this.toastService.showToast({
          message: '您已经成功提交本次值周记录！',
          showCloseButton: true,
          closeButtonText: '关闭',
          color: 'success',
          duration: 2000
        })

        this.resetSubItem(subItem)

        this.loadSubItemScoreHistory()
      })
      .catch(error => {
        this.toastService.showToast({
          message: '提交失败！出现意外错误，请稍后再试.',
          showCloseButton: true,
          closeButtonText: '关闭',
          color: 'danger',
          duration: 2000
        })
      })
  }

  clear(item: CheckItem, subItem: CheckSubItem) {
    subItem.scoreChange = 0
    subItem.addressList = []
  }

  resetSubItem(subItem: CheckSubItem) {
    subItem.scoreChange = 0
    subItem.addressList = []
  }

  loadCheckItems() {
    dbService.allItemList().then(itemList => {
      this.checkItems = itemList.map(item => {
        return {
          ...item.item,
          checkSubItems: item.subItemArr.map(subItem => {
            return {
              ...subItem,
              addressList: []
            }
          })
        }
      })
    })
  }
}
