import {render, screen} from '@testing-library/react'
import {Table} from '@components'
import {describe, it, expect} from 'vitest'

describe('Table', () => {
  interface MockInterface {
    id: number
    name: string
    address: string
  }

  const results = [
    {id: 1, name: 'Кинотеатр 1', address: 'Адрес 1'},
    {id: 2, name: 'Кинотеатр 2', address: 'Адрес 2'}
  ]
  const columns = [
    {key: 'name', title: 'Название', field: 'name'},
    {key: 'address', title: 'Адрес', field: 'address'}
  ]
  const props = {columns, results}

  it('should render table with correct data', () => {
    render(<Table<MockInterface> {...props} />)

    expect(screen.getByText(results[0].name)).toBeInTheDocument()
    expect(screen.getByText(results[1].address)).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })
})
