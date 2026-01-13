import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Check if JWT token is available
    if (!process.env.PINATA_JWT) {
      return NextResponse.json(
        { error: 'Pinata JWT token not configured' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Create form data for Pinata using native FormData
    const pinataFormData = new FormData()
    pinataFormData.append('file', file, file.name)
    
    const metadata = {
      name: file.name,
      keyvalues: {
        type: 'nft-image',
      },
    }
    pinataFormData.append('pinataMetadata', JSON.stringify(metadata))

    // Upload to Pinata using fetch
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      body: pinataFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Pinata API error details:', errorText)
      throw new Error(`Pinata API error: ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      ipfsHash: result.IpfsHash,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    })
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    return NextResponse.json(
      { error: 'Failed to upload to IPFS' },
      { status: 500 }
    )
  }
}
