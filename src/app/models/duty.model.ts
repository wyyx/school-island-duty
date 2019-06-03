export interface Chip {
  label: string
  rule: string
  value: number
}

export interface Grade {
  label: string
  value: number
  classes: AClass[]
}

export interface AClass {
  label: string
  value: number
}
