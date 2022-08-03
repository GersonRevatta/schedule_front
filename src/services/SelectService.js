import moment from 'moment'
export function useSelectService() {
  const _getDate = (_dateVar) => {
    return moment(_dateVar).format('YYYY-MM-DD')
  }

  let _date = moment().format('YYYY-MM-DD')
  let n = 0
  let data = []
  while (n < 6) {
    data.push({
      key: `${n}`,
      label: `Semana: ${moment(_date).startOf('isoweek').format('DD-MM-YYYY') } hasta ${ moment(_date).endOf('isoweek').format('DD-MM-YYYY') }`,
      icon: "pi pi-fw pi-inbox",
      date: _getDate(_date),
      startDate: _getDate(moment(_date).startOf('isoweek')),
      endDate: _getDate(moment(_date).endOf('isoweek').add(1, 'day')),
      month: moment(moment(_date)._d).format("MM")
    })
    _date = moment(_date).add(7, 'days').format('YYYY-MM-DD')
    n++
  }  
  return data
}