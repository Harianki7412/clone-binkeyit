import Axios from './Axios';
import SummaryApi from '../common/SummaryApi';

const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.userDetails
        })
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export default fetchUserDetails