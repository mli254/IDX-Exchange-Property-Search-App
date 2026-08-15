import {Link} from 'react-router-dom';

export default function NotFound() {
    return (
        <div className='w-[100%] h-100 flex flex-col items-center justify-center'>
            <h1 className='text-center font-bold text-4xl border-b-3 border-blue-900 pb-1 m-2'>
                Page Not Found
            </h1>
            <Link to={"/"}>
            <button className='m-3 px-2 py-1 text-center text-white font-bold bg-blue-900 rounded-sm cursor-pointer'>
                Go Back Home
            </button>
            </Link>
        </div>
    )
}