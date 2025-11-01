import {ReactNode} from 'react'

export interface Column<T> {
  key: string
  title?: string
  field?: string
  className?: string
  renderCellContent?: (params: {row: T; cell: string | number}) => ReactNode
}

export interface TableProps<T> {
  columns: Column<T>[]
  results: T[]
}

export interface SessionTime {
  time: string
  sessionId: number
}

export interface GroupedSession {
  id: number
  entityId: number
  entityTitle: string
  times: SessionTime[]
}
