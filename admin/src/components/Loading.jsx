import { LifeLine } from 'react-loading-indicators'

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-screen w-full flex-col gap-4'>
    <p className='text-xl font-semibold   text-gray-900'>Loading...</p>
  <LifeLine color="#5F6FFF" size="medium"  />
     </div>
  )
}

export default Loading