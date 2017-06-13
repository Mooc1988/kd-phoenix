/**
 * Created by frank on 2017/6/6.
 */
module.exports = {
  prefix: '/api/matches',
  ready: true,
  routes: [
    {
      path: '/',
      method: 'GET',
      handler: 'Match.findAll'
    },
    {
      path: '/ranges',
      method: 'GET',
      handler: 'Match.executeRange'
    },
    {
      path: '/lastRanges',
      method: 'GET',
      handler: 'Match.getLastRanges'
    },
    {
      path: '/dateRange',
      method: 'GET',
      handler: 'Match.getSeqDateRange'
    }
  ]
}