import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import Link from 'next/link'

import { DotsThreeFillY } from '@/components/icons/DotsThreeFillY'
import { DeleteImageDialog } from '@/components/images/dialogs'
import { IImageBordered } from '@/components/images/IImage'
import { IconButton } from '@/components/ui/Button'

import type { EImage } from '@/convex/types'

export const IImageCard = ({ image }: { image: EImage }) => {
  const [showDeleteImageDialog, setShowDeleteImageDialog] = useState(false)

  return (
    <IImageBordered image={image}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton
            aria-label="Options menu"
            variant="ghost"
            highContrast
            className="absolute right-1 top-1"
          >
            <DotsThreeFillY width={28} height={28} />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content variant="soft">
          <Link href={`/convex/${image.uid}?download`} target="_blank">
            <DropdownMenu.Item>
              <Icons.DownloadSimple size={16} />
              Download
            </DropdownMenu.Item>
          </Link>

          {image.userIsViewer && (
            <DropdownMenu.Item color="red" onClick={() => setShowDeleteImageDialog(true)}>
              <Icons.Trash size={16} />
              Delete
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <DeleteImageDialog
        imageId={image._id}
        open={showDeleteImageDialog}
        onOpenChange={setShowDeleteImageDialog}
      />
    </IImageBordered>
  )
}