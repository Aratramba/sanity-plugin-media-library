import { Asset } from './types/Asset'
import { MediaLibrary } from './components/MediaLibrary'
import { Sidebar } from './components/Sidebar'
import client from 'part:@sanity/base/client'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const StyledContainer = styled.div`
  background-color: #000;
  color: #ffffff;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`

const StyledSidebarGridContainer = styled.div`
  display: flex;
  height: 100%;
`

export const App = () => {
  const [assets, setAssets] = useState<Array<Asset>>([])
  const [filteredAssets, setFilteredAssets] = useState<Array<Asset>>(assets)
  const [loading, setLoading] = useState<Boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    if (!searchQuery || searchQuery === '') {
      return setFilteredAssets(assets)
    }

    const newFilteredAssets = [...assets].filter(({ originalFilename }) => originalFilename.indexOf(searchQuery) > -1)
    setFilteredAssets(newFilteredAssets)
  }, [assets, searchQuery])

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

  const mimeTypes: Array<string> = Array.from(new Set(assets.map(({ mimeType }) => mimeType)))
  const tags: Array<string> = Array.from(new Set(assets.reduce<Array<string>>((acc, { tags }) => tags ? [...acc, ...tags] : acc, [])))

  return (
    <StyledContainer>
      <StyledSidebarGridContainer>
        <Sidebar categories={mimeTypes} tags={tags} />
        <MediaLibrary assets={filteredAssets} loading={loading} isModal={false} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </StyledSidebarGridContainer>
    </StyledContainer>
  )
}