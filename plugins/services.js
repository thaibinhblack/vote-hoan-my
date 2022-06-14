import makeServices from '../apis/Service/DataUserApis'
export default ({ $axios }, inject) => {
    inject('services', makeServices($axios))
}
