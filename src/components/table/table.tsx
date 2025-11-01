import {TableProps} from '@types'
import './table.css'

export const Table = <T,>({columns, results}: TableProps<T>) => {

  return (
    <table className='table'>
      <thead>
        <tr>
          {columns.map(({key, className, title}) =>
            <th
              key={key}
              className={className}
            >
              {title}
            </th>)}
        </tr>
      </thead>
      <tbody>
        {results.map(row =>
          <tr key={row.id}>
            {columns.map(({key, field, renderCellContent}) => {
              const cell = row[field]
              const content = renderCellContent !== undefined ? renderCellContent({row, cell}) : cell
              return <td key={key}>{content}</td>
            })}
          </tr>
        )}
      </tbody>
    </table>)
}
