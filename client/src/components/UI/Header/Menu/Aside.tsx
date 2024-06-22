import React from 'react'

type Props = {
  device: string
}

export const Aside: React.FC<Props> = (props: Props) => {
  return (
    <aside className='absolute top-0 -left-1/2 bg-black h-screen w-1/2 -z-10'>Aside</aside>
  )
}