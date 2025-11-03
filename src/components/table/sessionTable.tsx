import {useNavigate} from 'react-router-dom'
import {GroupedSession, Page} from '@types'
import {Table} from './table'
import './table.css'
import {getRoute} from '@services'

interface SessionsTableProps {
  loading: boolean
  groupedSessions: {[key: string]: GroupedSession[]}
  title: string
  page: Page
}

export const SessionsTable = ({loading, groupedSessions, title}: SessionsTableProps) => {
  const navigate = useNavigate()
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
                          onClick={() => navigate(getRoute(Page.BOOKING, timeObj.sessionId))}
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
