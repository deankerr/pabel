import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Checkbox, DropdownMenu } from '@radix-ui/themes'
import { useMutation, usePaginatedQuery } from 'convex/react'
import NextImage from 'next/image'
import Link from 'next/link'

import { DotsThreeFillY } from '@/components/icons/DotsThreeFillY'
import { IconButton } from '@/components/ui/Button'
import { api } from '@/convex/_generated/api'

import type { Doc, Id } from '@/convex/_generated/dataModel'

export const ImageCardNext = ({
  image,
  children,
}: {
  image: Doc<'images_v2'> & {
    collectionIds: Id<'collections'>[]
  }
  children?: React.ReactNode
}) => {
  const collections = usePaginatedQuery(api.db.collections.list, {}, { initialNumItems: 50 })
  const updateCollection = useMutation(api.db.collections.update)

  return (
    <div
      key={image.id}
      style={{ aspectRatio: image.width / image.height }}
      className="w-52 overflow-hidden rounded-lg"
    >
      <NextImage
        alt=""
        key={image.id}
        src={`/i/${image.id}`}
        placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image?.blurDataUrl}
        width={image.width}
        height={image.height}
        className=""
      />
      <div className="absolute inset-0 rounded-lg border-2 border-grayA-5" />
      {children}

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
          <Link href={`/convex/${image.id}?download`}>
            <DropdownMenu.Item>
              <Icons.DownloadSimple />
              Download
            </DropdownMenu.Item>
          </Link>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <Icons.Plus />
              Add to collection
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>
                <Icons.Plus />
                Create new…
              </DropdownMenu.Item>
              <DropdownMenu.Separator />

              {collections.results.map((collection) => {
                const isInCollection = image.collectionIds?.some((id) => id === collection._id)

                return (
                  <DropdownMenu.Item
                    key={collection.id}
                    onClick={() => {
                      updateCollection({
                        collectionId: collection._id,
                        images_v2: {
                          add: isInCollection ? undefined : [image._id],
                          remove: isInCollection ? [image._id] : undefined,
                        },
                      })
                    }}
                  >
                    <Checkbox checked={isInCollection} />
                    {collection.title}
                  </DropdownMenu.Item>
                )
              })}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator />

          <DropdownMenu.Item color="red">
            <Icons.Trash />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
