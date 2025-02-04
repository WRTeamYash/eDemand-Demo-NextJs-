import { useTranslation } from '@/components/Layout/TranslationContext';
import MiniLoader from '@/components/ReUseableComponents/MiniLoader';
import React from 'react'
import { FaPlus } from 'react-icons/fa';
import { RiSendPlaneFill } from 'react-icons/ri';

const AdminChat = ({ handleScroll, isLoading, chatMessages, attachedFiles, handleFileAttachment, message, handleMessageChange, MaxCharactersInTextMessage, handleSend, isSending, userData, renderMessage, renderFilePreview }) => {

    const t = useTranslation();

    return (
        <div className='flex-1 flex flex-col'>
            <div className='p-3 flex items-center border-b border-gray-300 gap-3'>
                <div className='flex flex-col gap-1 items-start'>
                    <h2 className='text-xl'>{t("customerSupport")}</h2>
                </div>
            </div>
            <div className='flex flex-col gap-3 p-4 overflow-auto h-[600px] chatsWrapper justify-start chat_messages_screen' onScroll={handleScroll}>
                {
                    isLoading ? <div className='h-full w-full flex items-center justify-center'>{t("loading")}</div> :
                        chatMessages && chatMessages.length > 0 ?
                            <div className='flex flex-col-reverse'>
                                {chatMessages?.map((message, index) => (
                                    <div key={index} className={`flex ${(userData?.id === message?.sender_id || userData?.id === message?.sender_details?.id) ? 'justify-end senderMsg' : 'justify-start otherMsg'}`}>
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

            {/* send msg container  */}            
            <div className='p-4 grid grid-cols-12 relative border-t'>
                {/* selectedFiles */}
                {

                    attachedFiles?.length > 0 &&
                    <div className='absolute bg-gray-100 w-full overflow-x-auto p-2 bottom-[70px] selectedFiles mb-1'>
                        <span>Selected Files :</span>
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
                    <input className='w-[56%] sm:w-[80%] xl:w-full border p-2 rounded-lg' type='text' value={message} onChange={handleMessageChange} placeholder='Type a message...' />
                </div>
                <div className='h-full flex items-center justify-end col-span-2 gap-2'>
                    <span className='text-gray-400'> {message.length}/{MaxCharactersInTextMessage}</span>
                    <button className={`primary_bg_color px-2 sm:px-4 h-full flex items-center text-center rounded-lg text-white ${isSending && 'cursor-not-allowed'}`}
                        onClick={handleSend} disabled={isSending}>
                        {
                            isSending ?
                                <MiniLoader chatPage={true} /> :
                                <RiSendPlaneFill size={18} />
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminChat