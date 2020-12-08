import React from 'react'

type Props = {
  tool?: string
}

export const App = ({ tool }: Props) => {
  console.log(tool)

  return <div>Hier is mijn App</div>
}