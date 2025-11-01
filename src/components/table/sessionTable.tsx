import {Table} from './table'
import './table.css'
import {Column, GroupedSession} from '@types'

interface SessionsTableProps {
  groupedSessions: {[key: string]: GroupedSession[]}
  columns: Column<GroupedSession>[]
  onSessionSelect: (sessionId: number) => void
}

export const SessionsTable = ({groupedSessions, columns, onSessionSelect}: SessionsTableProps) => {
  return (
    <div className='sessions-table-container'>
      {Object.entries(groupedSessions).map(([date, dateSessions]) => (
        <div key={date} className='date-section'>
          <h3 className='date-title'>{date}</h3>
          <Table<GroupedSession>
            columns={columns.map(col =>
              col.key === 'times'
                ? {
                  ...col,
                  renderCellContent: ({row}: {row: GroupedSession}) => (
                    <div className='times-container'>
                      {row.times.map((timeObj, index) => (
                        <span
                          key={index}
                          className='time-chip'
                          onClick={() => onSessionSelect(timeObj.sessionId)}
                        >
                          {timeObj.time}
                        </span>
                      ))}
                    </div>
                  )
                }
                : col
            )}
            results={dateSessions}
          />
        </div>
      ))}

      {Object.keys(groupedSessions).length === 0 && (
        <div className='no-sessions'>На выбранную дату сеансов нет</div>
      )}
    </div>
  )
}
