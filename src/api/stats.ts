import axios from 'axios'

export const getStatsMounth = async () => {
  const response = await axios.get('http://89.169.45.7:3000/api/stats/mounth', {
    headers: {
      Authorization: localStorage.getItem('acessToken'),
    },
  })

  return response.data
}

export const getStatsStatus = async () => {
  const response = await axios.get('http://89.169.45.7:3000/api/stats/statuses', {
    headers: {
      Authorization: localStorage.getItem('acessToken'),
    },
  })

  return response.data
}
