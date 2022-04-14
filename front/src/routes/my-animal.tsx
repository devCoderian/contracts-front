import React, {FC} from 'react'

interface MyAnimalProps{
    account: string;
}

const MyAnimal:FC<MyAnimalProps> = () => {
  return (
    <div>my-animal</div>
  )
}

export default MyAnimal