import { Observable, from } from 'rxjs'
import { tap } from 'rxjs/operators'

console.log('oooooooooooo')

const p = new Promise((resolve, reject) => {
  resolve('houdini')
})

from(p)
  .pipe(
    tap(res => {
      console.log('TCL: res', res)
    })
  )
  .subscribe()
