/**
 * Created by frank on 2017/6/6.
 */
module.exports = {
  prefix: '/api/aus/matches',
  ready: true,
  routes: [

    {
      path: '/ranges',
      method: 'GET',
      handler: 'MatchAus.executeRange'
    }
  ]
}