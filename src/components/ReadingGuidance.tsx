import { Button } from '@heroui/button'
import { Modal, ModalBody, ModalContent, useDisclosure } from '@heroui/react'
import { memo } from 'react'
import { Info } from 'react-feather'

type Props = {
  content?: string
}

const ReadingGuidance: React.FC<Props> = ({ content }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!content) return null

  return (
    <div>
      <Button color='primary' variant='light' onPress={onOpen} isIconOnly>
        <Info />
      </Button>
      <Modal backdrop='blur' isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalBody className='py-6'>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default memo(ReadingGuidance)
