import React, { useEffect, useState } from 'react'
import client from 'part:@sanity/base/client'

export const App = () => {
  const [assets, setAssets] = useState([])

  useEffect(() => {
    (async function asyncFunction () {
      const newAssets = await client.fetch(`*[_type == "sanity.imageAsset"]`, {})
      setAssets(newAssets)
      console.log(newAssets)
    })()
  }, [])

  return (
    <div>
      <div>
        <div>
          <div><input type="search" placeholder="Search..." /></div>
          <div>
            <h2>Categories</h2>
            <ul>
              {['pdf', 'image', 'video'].map(x => <li><button>{x}</button></li>)}
            </ul>
          </div>
          <div>
            <h2>Tags</h2>
            <ul>
              {['projects', 'people', 'red'].map(x => <li><button>{x}</button></li>)}
            </ul>
          </div>
          <div><button>Upload</button></div>
        </div>
        <div>
          {assets.map(({ url}) => <img src={`${url}?w=200&h=200`} />)}
        </div>
      </div>

      <div>
        <button>Cancel</button> of <button>Insert</button>
      </div>
  </div>
  )
}