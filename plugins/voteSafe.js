import VoteSafeServices from '@/apis/Service/VoteSafeTyApi'

export default ({ $axios }, inject) => {
  inject('voteSafe', VoteSafeServices($axios))
}
