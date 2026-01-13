import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json()

    if (!metadata.name || !metadata.description || !metadata.image) {
      return NextResponse.json(
        { error: 'Missing required metadata fields' },
        { status: 400 }
      )
    }

    // Upload metadata to Pinata using fetch
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataMetadata: {
          name: `${metadata.name} - NFT Metadata`,
          keyvalues: {
            type: 'nft-metadata',
            name: metadata.name,
          },
        },
        pinataContent: metadata,
      }),
    })

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.statusText}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      ipfsHash: result.IpfsHash,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    })
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error)
    return NextResponse.json(
      { error: 'Failed to upload metadata to IPFS' },
      { status: 500 }
    )
  }
}
