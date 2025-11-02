import {Table} from './table'
import {GroupedSession} from '@types'
import './table.css'

interface SessionsTableProps {
  loading: boolean
  groupedSessions: {[key: string]: GroupedSession[]}
  title: string
  onSessionSelect: (sessionId: number) => void
}

export const SessionsTable = ({loading, groupedSessions, title, onSessionSelect}: SessionsTableProps) => {
  if (loading) {
    return <div className='loading'>Загрузка сеансов...</div>
  }

  const columns = [
    {
      key: 'movie',
      title,
      field: 'entityTitle'
    },
    {
      key: 'times',
      title: 'Время'
    }
  ]

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
                : col)}
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
