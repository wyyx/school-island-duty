import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BASE_URL } from '../app.module'
import { AddDutyResponse, GetDutyHistoryListResponse, NewDuty } from '../models/duty.model'

@Injectable({
  providedIn: 'root'
})
export class DutyService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  constructor(@Inject(BASE_URL) private baseUrl: string, private http: HttpClient) {}

  add(duties: NewDuty[]): Observable<AddDutyResponse> {
    const url = `${this.baseUrl}/w/score/add`

    return this.http.post<AddDutyResponse>(url, duties, {
      headers: this.headers
    })
  }

  getDutyHistoryList(body: { classId: number; pageNo: number; pageSize: number }) {
    const url = `${this.baseUrl}/w/score/list-page`

    return this.http.post<GetDutyHistoryListResponse>(url, body, {
      headers: this.headers
    })
  }

  // get() {
  //   return this.http.post('/', {})
  // }
}
