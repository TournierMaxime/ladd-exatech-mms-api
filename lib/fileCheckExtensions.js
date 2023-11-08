import Images from '../models/Images.js'
import Attachments from '../models/Attachments.js'

const fileCheckExtensions = async (file, data, protocol, host, pathType, paramsId) => {
  const fileExtension = file.originalname.split('.').pop()
  const imgExt = ['jpeg', 'jpg', 'png']
  const docExt = ['doc', 'docx', 'xls', 'xlsx', 'pdf']

  let filePath

  switch (pathType) {
    case 'faq-sections':
      filePath = `${protocol}://${host}/var/data/faq/${paramsId}/faq-sections/${data.sectionId}/${file.filename}`
      if (imgExt.includes(fileExtension)) {
        await Images.create({
          imagePath: filePath,
          faqId: paramsId,
          sectionId: data.sectionId
        })
      }
      break
    case 'tickets':
      filePath = `${protocol}://${host}/var/data/tickets/${data.ticketId}/${file.filename}`
      if (imgExt.includes(fileExtension)) {
        await Images.create({
          imagePath: filePath,
          ticketId: data.ticketId
        })
      }
      break
    case 'comments':
      filePath = `${protocol}://${host}/var/data/tickets/${paramsId}/comments/${data.commentId}/${file.filename}`
      if (imgExt.includes(fileExtension)) {
        await Images.create({
          imagePath: filePath,
          commentId: data.commentId
        })
      }
      if (docExt.includes(fileExtension)) {
        await Attachments.create({
          file: filePath,
          commentId: data.commentId
        })
      }
      break
    case 'interventions':
      filePath = `${protocol}://${host}/var/data/interventions/${data.interventionId}/${file.filename}`
      if (imgExt.includes(fileExtension)) {
        await Images.create({
          imagePath: filePath,
          interventionId: data.interventionId
        })
      }
      if (docExt.includes(fileExtension)) {
        await Attachments.create({
          file: filePath,
          interventionId: data.interventionId
        })
      }
      break
    default:
      throw new Error('Invalid path type provided')
  }
}

export default fileCheckExtensions
