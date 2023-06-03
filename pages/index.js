import Button from '../components/Button';
import { useState, useRef, useMemo } from 'react';
import { useCreateAsset, Player } from '@livepeer/react';
 
export default function Home() {
  const [asset, setAsset] = useState(null);
  // Ref for the file input
  const fileInput = useRef(null);

  const {
    mutate: createAsset,
    data: assets,
    progress,
    error,
  } = useCreateAsset(
    asset ?
    {
      sources: [
        {
          name: asset.name, 
          file: asset,
          storage: {
            ipfs: true,
          }
        }
      ]
    } :
    null
  )

  const ChooseAsset = async () => {
    // When user clicks the button, open the file input dialog
    fileInput.current?.click();
  };
  
  const onChange = async (e) => {
    // Get the file
    const file = e.target.files?.[0];
    // If no file, return
    if (!file) return;
    // If there is a file, set the asset state to the file
    setAsset(file);
  };
   
  const uploadAsset = async () => {
    await createAsset?.();
  }

  const progressFormatted = useMemo(
    () =>
      progress?.[0].phase === 'failed'
        ? 'Failed to process video.'
        : progress?.[0].phase === 'waiting'
        ? 'Waiting'
        : progress?.[0].phase === 'uploading'
        ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
        : progress?.[0].phase === 'processing'
        ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
        : null,
    [progress],
  )

  // Player
  const [url, setUrl] = useState('')

  return (
    <div className="flex flex-col justify-center items-center h-screen font-poppins">
      <h1 className="text-9xl font-bold text-slate-900 text-transparent bg-clip-text bg-gradient-to-r from-[#00A660] to-[#28CE88]">
        Livepeer x IPFS
      </h1>
      <h3 className="text-xl mt-6 text-slate-800 w-[50%] text-center">
        Upload, stream, and transcode video on the decentralized web with
        Livepeer and IPFS.
      </h3>
      <Button onClick={asset ? uploadAsset : ChooseAsset}>
        {asset ? 'Upload the asset' : 'Choose an asset'}
      </Button>
      <input type="file" ref={fileInput} className="hidden" onChange={onChange} />
      <p>{progressFormatted}</p>
      {
        assets?.map((asset) => (
          <div key={asset.id}>
            <div>
              <div>Asset Name: {asset?.name}</div>
              <div>Playback URL: {asset?.playbackUrl}</div>
              <div>IPFS CID: {asset?.storage?.ipfs?.cid ?? 'None'}</div>
            </div>
          </div>
        ))
      }
    <p>IPFS URL</p>
    <input type='text' placeholder='ipfs://' onChange={(e) => setUrl(e.target.value)} />
    {url && <p>Provided value is not a valid identifier</p>}
    {
      url && (
        <Player 
          title={url}
          src={url}
          autoPlay
          muted
          autoUrlUpload={{ fallback: true, ipfsGateway: 'https://w3s.link'}}
        />
      )
    }
    </div>
  );
}