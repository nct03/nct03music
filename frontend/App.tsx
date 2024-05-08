import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigators/RootNavigator';
import { Provider } from 'react-redux';
import store from './src/redux/store';

export default function App() {
    return (
        <>
            <StatusBar />
            <Provider store={store}>
                <RootNavigator />
            </Provider>
        </>
    );
}

