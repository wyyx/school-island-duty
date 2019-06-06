interface SqlRowList<T> {
  [key: number]: T
}

export function convertToArray<T>(sqlRowList: SqlRowList<T>) {
  const arr: T[] = []

  Object.keys(sqlRowList).forEach(key => {
    arr.push(sqlRowList[key])
  })

  return arr
}
