import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import './App.css'
import ListingsPage from './pages/ListingsPage'

function App() {
  return (
    <>
    <ErrorBoundary fallbackRender={({error}) => (
      <div className="w-96 m-auto my-[5rem] p-2 text-red-600 text-center border-red-400 border-2">
        <p className="text-2xl font-bold">Something Went Wrong</p>
        <pre>Error Message: {getErrorMessage(error)}</pre>
      </div>
    )}>
      <ListingsPage />
    </ErrorBoundary>
    </>
  )
}

export default App
