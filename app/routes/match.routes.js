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
      path: '/seqs/:seq',
      method: 'GET',
      handler: 'Match.findAllBySeq'
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
      path: '/lastUpdateDate',
      method: 'GET',
      handler: 'Match.getLastUpdateDate'
    },
    {
      path: '/curlCaiqr',
      method: 'POST',
      handler: 'Match.curlCaiqr'
    }
  ]
}