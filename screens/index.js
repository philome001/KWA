// export { default as StartScreen } from './StartScreen'
// export { default as LoginScreen } from './Login'
// export { default as RegisterScreen } from './RegisterScreen'
// export { default as ResetPasswordScreen } from './ResetPasswordScreen'
// export { default as Dashboard } from './DashboardForm'

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
