import * as yup from 'yup';
import { requiredMessage } from '../utils/helpers';
import { ENV_CURRENT, ENV_NAME, ENV_SCOPE, ENV_VALUE } from '../constants';

export const envSchema = yup.object({
  name: yup.string().required(requiredMessage(ENV_NAME)),
  value: yup.string().required(requiredMessage(ENV_VALUE)),
  scope: yup.string().required(requiredMessage(ENV_SCOPE)),
  current: yup.string().required(requiredMessage(ENV_CURRENT)),
});
