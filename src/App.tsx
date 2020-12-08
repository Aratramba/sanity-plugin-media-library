import React, { useEffect, useState } from 'react'
import client from 'part:@sanity/base/client'

interface Asset {
  _id: string,
  alt?: string,
  mimeType: string,
  tags?: Array<string>,
  url: string,
}

export const App = () => {
  const [assets, setAssets] = useState<Array<Asset>>([])
  const [loading, setLoading] = useState<Boolean>(true)

  useEffect(() => {
    (async function asyncFunction() {
      try {
        const newAssets: Array<Asset> = await client.fetch(`*[_type == "sanity.imageAsset"]`, {})
        setAssets(newAssets)
        console.log(newAssets)

        // const response = await client.patch(newAssets[0]._id).set({ tags: ['test'], alt: 'flap', }).commit()
        // console.log(response)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const mimeTypes = assets.map(({ mimeType }) => mimeType)

  return (
    <div>
      <div>
        <div>
          <div><input type="search" placeholder="Search..." /></div>
          <div>
            <h2>Categories</h2>
            <ul>
              {mimeTypes.map(x => <li key={x}><button>{x}</button></li>)}
            </ul>
          </div>
          <div>
            <h2>Tags</h2>
            <ul>
              {['projects', 'people', 'red'].map(x => <li key={x}><button>{x}</button></li>)}
            </ul>
          </div>
          <div><button>Upload</button></div>
        </div>
        <div>
          {loading && <div>Loading</div>}
          {assets.map(({ url }) => <img src={`${url}?w=200&h=200&fit=crop`} />)}
        </div>
      </div>

      <div>
        <button>Cancel</button> of <button>Insert</button>
      </div>
    </div>
  )
}