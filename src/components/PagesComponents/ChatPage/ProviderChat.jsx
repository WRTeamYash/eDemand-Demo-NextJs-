import { useTranslation } from '@/components/Layout/TranslationContext'
import MiniLoader from '@/components/ReUseableComponents/MiniLoader'
import React from 'react'
import { FaPlus } from 'react-icons/fa'
import { RiSendPlaneFill } from 'react-icons/ri'
import noChat from '../../../assets/chat.svg'
import CustomImageTag from '@/components/ReUseableComponents/CustomImageTag'
import { useRTL } from '@/utils/Helper'

const ProviderChat = ({ handleScroll, isLoading, chatMessages, attachedFiles, handleFileAttachment, message, handleMessageChange, MaxCharactersInTextMessage, handleSend, isSending, userData, renderMessage, selectedChatTab, renderFilePreview, chatList }) => {

    const t = useTranslation();
    const isRTL = useRTL();

    return (
        <div className='flex-1 flex flex-col'>
            {
                selectedChatTab && Object.keys(selectedChatTab).length > 0 ? <>
                    <div className='p-4 flex items-center border-b border-gray-300 gap-3'>
                        <CustomImageTag 
                        className='!h-10 !w-10 rounded-full object-cover' 
                        src={selectedChatTab?.image} 
                        alt={selectedChatTab?.partner_name} />
                        <div className='flex flex-col gap-1 items-start'>
                            <h2 className=''>{selectedChatTab?.partner_name}</h2>
                            {selectedChatTab?.booking_id !== null ? (
                                selectedChatTab?.booking_id &&
                                <div className='flex flex-col'>
                                    <div className="booking_id flex gap-1 items-center">
                                        <span className='description_color'>{t("bookingId")}:</span>
                                        <span>{selectedChatTab?.booking_id}</span>
                                    </div>
                                </div>
                            ) : (
                                <h3 className='text-gray-400'>{t("preBookingEnq")}</h3>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 p-4 overflow-auto h-[600px] chatsWrapper justify-start chat_messages_screen' onScroll={handleScroll}>
                        {
                            isLoading ? <div className='h-full w-full flex items-center justify-center'>{t("loading")}</div> :
                                chatMessages && chatMessages.length > 0 ? <div className='flex flex-col-reverse'>

                                    {chatMessages?.map((message, index) => (
                                        <div key={index} className={`flex ${userData?.id == message?.sender_details?.id ? 'justify-start senderMsg' : 'justify-end otherMsg'}`}>
                                            {renderMessage(message)}
                                        </div>

                                    ))}
                                </div>
                                    :
                                    <div className='flex items-center justify-center h-full'>
                                        <h2>{t("noChatMessageFound")}</h2>
                                    </div>
                        }
                    </div>
                </>
                    :
                    <div className='flex items-center flex-col justify-center text-center h-full gap-3 p-12'>
                        <CustomImageTag src={noChat.src} alt="noChat" className='w-auto object-contain' />
                        <h2 className='font-[700] text-[16px] md:text-[20px]'>{t("welcomeTo")} {process.env.NEXT_PUBLIC_APP_NAME} - {t("onDemandServices")}</h2>
                        {chatList?.length > 0 &&
                            <p>{t("pickPersonFromLeftMenu")}</p>
                        }
                    </div>
            }


            {/* send msg container  */}
            {
                selectedChatTab?.order_status === "cancelled" || selectedChatTab?.order_status === "completed" ? <div className='light_bg_color text-center p-2'>
                    <h6>{t("sorryYouCantSendMessage")}</h6>
                </div>
                    :
                    selectedChatTab &&
                    <div className='p-4 grid grid-cols-12 relative border-t'>
                        {/* selectedFiles */}
                        {

                            attachedFiles?.length > 0 &&
                            <div className='absolute bg-gray-100 w-full overflow-x-auto p-2 bottom-[70px] selectedFiles mb-1'>
                                <span>{t("selectedFiles")}</span>
                                <div className='flex items-center gap-2 mt-2'>
                                    {attachedFiles.map((file, index) => renderFilePreview(file, index))}
                                </div>
                            </div>
                        }
                        <div className='flex items-center gap-2 col-span-10'>
                            <input
                                type="file"
                                id="file-attachment"
                                style={{ display: 'none' }}
                                onChange={handleFileAttachment}
                                multiple
                            />
                            <button className='primary_bg_color rounded-full h-[30px] w-[30px] flex justify-center text-white items-center ' onClick={() => document.getElementById('file-attachment').click()}><FaPlus size={18} /></button>
                            <input className='w-[56%] sm:w-[80%] xl:w-full border p-2 rounded-lg' type='text' value={message} onChange={handleMessageChange} placeholder={t("typeMessage")} />
                        </div>
                        <div className='h-full flex items-center justify-end col-span-2 gap-2'>
                            <span className='text-gray-400'> {message.length}/{MaxCharactersInTextMessage}</span>
                            <button className={`primary_bg_color px-2 sm:px-4 h-full flex items-center text-center rounded-lg text-white ${isSending && 'cursor-not-allowed'}`}
                                onClick={handleSend} disabled={isSending}>
                                {
                                    isSending ?
                                        <MiniLoader chatPage={true} />
                                        :
                                        <RiSendPlaneFill size={18} />
                                }
                            </button>
                        </div>
                    </div>
            }
        </div>
    )
}

export default ProviderChat