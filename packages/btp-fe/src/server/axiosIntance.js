import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mockUser from 'server/mock/mock-users';

const mockApi = new MockAdapter(axios);

mockApi.onDelete().reply(200, true);
mockApi.onPost().reply(200, true);
mockApi.onPut().reply(200, true);

mockUser(mockApi);
// PLOP-ADD-MOCK

export default axios;
