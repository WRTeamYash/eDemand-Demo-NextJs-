import Layout from '@/components/Layout/Layout'
import BreadCrumb from '@/components/ReUseableComponents/BreadCrumb'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { FaFile } from "react-icons/fa";
import { IoMdClose, IoMdDownload } from 'react-icons/io';
import Lightbox from '@/components/ReUseableComponents/CustomLightBox/LightBox';
import { useSelector } from 'react-redux';
import { fetch_chat_history, fetch_providr_chat_list, send_chat_message } from '@/api/apiRoutes';
import { useTranslation } from '@/components/Layout/TranslationContext';
import { getUserData } from '@/redux/reducers/userDataSlice';
import moment from 'moment';
import withAuth from '@/components/Layout/withAuth';
import { getChatData, selectHelperState } from '@/redux/reducers/helperSlice';
import { toast } from 'react-toastify';
import { Skeleton } from '@/components/ui/skeleton';
import AdminChat from './AdminChat';
import ChatList from './ChatList';
import ProviderChat from './ProviderChat';
import CustomImageTag from '@/components/ReUseableComponents/CustomImageTag';
import { isMobile } from '@/utils/Helper';

const ChatPage = ({ notificationData }) => {

    const t = useTranslation();
    
    const settingsData = useSelector((state) => state?.settingsData);

    const userData = useSelector(getUserData);

    const chatListRef = useRef(null);

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentImages, setCurrentImages] = useState([]);

    useEffect(() => {
        
        if (notificationData) {
            let newMessage = {
                sender_details: { id: notificationData.sender_id },
                timestamp: new Date().toISOString() // Add a timestamp if not provided in the notification
            };

            // Handle text message
            if (notificationData.message) {
                newMessage.message = notificationData.message;
            }

            // Handle file
            if (notificationData.file) {
                let parsedFile;
                if (typeof notificationData.file === 'string') {
                    try {
                        parsedFile = JSON.parse(notificationData.file);
                    } catch (error) {
                        console.error('Error parsing file data:', error);
                        parsedFile = [];
                    }
                } else {
                    parsedFile = notificationData.file;
                }

                // Flatten the nested array
                const flattenedFiles = parsedFile.flat();

                newMessage.file = flattenedFiles.map(file => ({
                    file: file.file || file.url,
                    file_name: file.file_name || file.name,
                    file_type: file.file_type || file.type
                }));
            }

            setChatMessages(prevMessages => [newMessage, ...prevMessages]);
            scrollToBottom();
        }
    }, [notificationData])

    const handleOpenLightbox = useCallback((index, images) => {
        setCurrentImages(images?.map(img => ({
            src: img.file,
            alt: img.file_name,
            type: img.file_type
        })));
        setCurrentImageIndex(index);
        setIsLightboxOpen(true);
    }, []);

    const handleCloseLightbox = useCallback(() => {
        setIsLightboxOpen(false);
    }, []);

    const helperStateData = useSelector(selectHelperState)

    const newChat = helperStateData?.chatData;

    const [newStoredChat, setNewStoredChat] = useState()
    const [message, setMessage] = useState('')

    const [chatList, setChatList] = useState([]);

    const [isAdmin, setIsAdmin] = useState(false);
    const [offset, setOffset] = useState(0);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [selectedChatTab, setSelectedChatTab] = useState(null);

    const [listOffset, setListOffset] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreChats, setHasMoreChats] = useState(true);

    const [chatMessages, setChatMessages] = useState([]);


    const listLimit = 10;
    const msgListLimit = 25;

    const MaxCharactersInTextMessage = settingsData?.settings?.general_settings?.maxCharactersInATextMessage
    const MaxFileSizeInMBCanBeSent = settingsData?.settings?.general_settings?.maxFileSizeInMBCanBeSent
    const MaxFilsOrImagesInOneMessage = settingsData?.settings?.general_settings?.maxFilesOrImagesInOneMessage


    const [attachedFiles, setAttachedFiles] = useState([]);

    const handleChangeTab = (e, chat) => {
        e.preventDefault();
        setSelectedChatTab(chat);
        setIsAdmin(false)

    };

    const handleFileAttachment = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const fileSizeInMB = file.size / (1024 * 1024);
            if (fileSizeInMB > MaxFileSizeInMBCanBeSent) {
                toast.error(`${t("file")} ${file.name} ${t("exceedTheMaximumSizeOf")} ${MaxFileSizeInMBCanBeSent}${t("mb")}.`);
                return false;
            }
            return true;
        });

        if (attachedFiles.length + validFiles.length > MaxFilsOrImagesInOneMessage) {
            toast.error(`${t("youCanOnlyAttachUpTo")} ${MaxFilsOrImagesInOneMessage} ${t("filesOrImagesInOneMessage")}.`);
            validFiles.splice(MaxFilsOrImagesInOneMessage - attachedFiles.length);
        }

        setAttachedFiles(prevFiles => [...prevFiles, ...validFiles]);
    };

    const handleMessageChange = (e) => {
        const newMessage = e.target.value;
        if (newMessage.length <= MaxCharactersInTextMessage) {
            setMessage(newMessage);
        } else {
            toast.error(`${t("messageCannotExceed")} ${MaxCharactersInTextMessage} ${t("characters")}.`);
        }
    };

    const removeAttachedFile = (index) => {
        setAttachedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };
    const isImageFile = (file) => {
        return file.type.startsWith('image/');
    };

    const renderFilePreview = (file, index) => {
        if (isImageFile(file)) {
            return (
                <div key={index} className="file-card image-card relative flex flex-col gap-2 justify-center items-center border border-gray-300 rounded-sm p-1 bg-white">
                    <CustomImageTag src={URL.createObjectURL(file)} alt={file.name} className='w-[160px] h-[100px]' />
                    <span>{file.name}</span>
                    <button onClick={() => removeAttachedFile(index)} className='absolute -top-1 -right-1 bg-gray-200 p-1 rounded-full'>
                        <IoMdClose size={14} />
                    </button>
                </div>
            );
        } else {
            return (
                <div key={index} className="file-card relative flex flex-col gap-2 justify-center items-center border border-gray-300 rounded-sm p-1 bg-white">
                    <FaFile size={24} />
                    <span>{file.name}</span>
                    <button onClick={() => removeAttachedFile(index)} className='absolute -top-1 -right-1 bg-gray-200 p-1 rounded-full'>
                        <IoMdClose size={14} />
                    </button>
                </div>
            );
        }
    };

    useEffect(() => {
        if (newChat) {
            setNewStoredChat(newChat);
            setSelectedChatTab(newChat)
        }
    }, [newChat]);


    const fetchList = async (offset = 0) => {
        if (!hasMoreChats || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            const response = await fetch_providr_chat_list({
                limit: listLimit.toString(),
                offset: offset.toString()
            });
            let list = response?.data || [];

            if (!Array.isArray(list)) {
                list = [];
            }

            if (offset === 0) {
                setChatList(list);
            } else {
                setChatList(prevList => [...prevList, ...list]);
            }

            setListOffset(prevOffset => prevOffset + list.length);
            setHasMoreChats(list.length === listLimit);
            setIsInitialLoading(false);
        } catch (error) {
            console.error('Error fetching chat list:', error);
            setIsInitialLoading(false);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const fetchChatMessages = async (selectedChatTab, newOffset = 0, append = false) => {
        setIsLoading(true);
        try {
            const response = await fetch_chat_history({
                type: isAdmin ? "0" : "1",
                booking_id: selectedChatTab?.booking_id,
                provider_id: selectedChatTab?.partner_id,
                limit: msgListLimit,
                offset: newOffset
            });
            const messages = response?.data;

            if (messages.length < msgListLimit) {
                setHasMore(false);
            }

            if (append) {
                setChatMessages(prevMessages => [...prevMessages, ...messages]);
            } else {
                setChatMessages(messages);
            }

            setOffset(newOffset);
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScroll = (e) => {
        const { scrollTop } = e.currentTarget;
        if (scrollTop === 0 && !isLoading && hasMore) {
            fetchChatMessages(selectedChatTab, offset + 1, true);
        }
    };
    useEffect(() => {
        if (selectedChatTab || isAdmin) {
            setOffset(0);
            setHasMore(true);
            fetchChatMessages(selectedChatTab);
        }
    }, [selectedChatTab, isAdmin]);

    const handleChatListScroll = () => {
        if (chatListRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
            if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoadingMore && hasMoreChats) {
                fetchList(listOffset);
            }
        }
    };

    useEffect(() => {
        fetchList();
    }, []); // Fetch initial chat list on component mount


    const renderMessage = (message) => {
        const TextMessages = message && message.message;
        let files;

        if (typeof message?.file === 'string') {
            try {
                files = JSON.parse(message.file);
            } catch (error) {
                console.error('Error parsing file string:', error);
                files = [];
            }
        } else if (Array.isArray(message?.file)) {
            files = message.file;
        } else {
            files = [];
        }

        const FileMessages = files.length > 0;
        const TextAndFiles = TextMessages && FileMessages;

        const imageFiles = Array.isArray(files) ? files.filter(file =>
            file.file_type === 'image/jpeg' ||
            file.file_type === 'image/png' ||
            file.file_type === 'image/jpg' ||
            file.file_type === 'image/svg+xml'
        ) : [];


        if (TextAndFiles) {
            return (

                <div className={`flex flex-col w-full ${(userData?.id === message?.sender_id || userData?.id === message?.sender_details?.id) ? 'justify-end items-end' : 'justify-start items-start'}`}>
                    <div className={`flex flex-col gap-1 ${(userData?.id === message?.sender_id || userData?.id === message?.sender_details?.id) ? 'justify-end items-end' : ''}`}>
                        {
                            message.message.trim() !== '' &&
                            <p className={`px-6 py-2 max-w-[230px] sm:max-w-[370px] xl:max-w-[440px] ${(userData?.id === message?.sender_id || userData?.id === message?.sender_details?.id) ? 'primary_bg_color text-white' : 'bg-[#F2F1F6] text-black'} my-1 message`}>
                                {message.message}
                            </p>
                        }
                    </div>
                    {renderImageFiles(imageFiles && imageFiles)}
                    {renderNonImageFiles(files, imageFiles && imageFiles)}
                    <span className='text-[12px] description_color mb-2'>
                        {formatTimeDifference(message.created_at)}
                    </span>
                </div>
            );
        } else if (TextMessages) {
            return (
                <div className={`flex flex-col w-full ${(userData?.id === message?.sender_id || userData?.id === message?.sender_details?.id) ? 'justify-end items-end' : 'justify-start items-start'}`}>
                    <div className={`flex flex-col gap-1 ${(userData?.id === message?.sender_id || userData?.id === message?.sender_details?.id) ? 'justify-end items-end' : 'justify-start items-start'}`}>
                        {
                            message.message.trim() !== '' &&
                            <p className={`px-6 py-2 max-w-[230px] sm:max-w-[370px] xl:max-w-[440px] ${(userData?.id === message?.sender_id || userData?.id === message?.sender_details?.id) ? 'primary_bg_color text-white' : 'bg-[#F2F1F6] text-black'} my-1 message`}>
                                {message.message}
                            </p>
                        }
                        <span className='text-[12px] description_color mb-2'>
                            {formatTimeDifference(message.created_at)}
                        </span>
                    </div>
                </div>
            );
        } else if (FileMessages) {
            return (
                <div className={`flex flex-col w-full  ${(userData?.id === message?.sender_id || userData?.id === message?.sender_details?.id) ? 'justify-end items-end' : 'justify-start items-start'}`}>
                    <div className={`flex flex-col gap-1 ${(userData?.id === message?.sender_id || userData?.id === message?.sender_details?.id) ? 'justify-end items-end' : ''}`}>
                        {renderImageFiles(imageFiles)}
                        {renderNonImageFiles(files, imageFiles)}
                        <span className='text-[12px] description_color mb-2'>
                            {formatTimeDifference(message.created_at)}
                        </span>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };

    const renderImageFiles = (imageFiles) => {

        return (
            <>
                <div className='flex items-center justify-end gap-2 flex-wrap w-[70%] mb-1'>
                    {imageFiles.slice(0, 4).map((file, index) => {
                        return <div key={index} onClick={() => handleOpenLightbox(index, imageFiles)} className='cursor-pointer'>
                            {file.file_type === 'image/svg+xml' ? (
                                <CustomImageTag
                                    src={file.file}
                                    alt={file.file_name}
                                    className="image-item svg-item w-[160px] h-[100px] border rounded-sm object-fill"
                                />
                            ) : (
                                <CustomImageTag
                                    src={file.file}
                                    alt={file.file_name}
                                    className="image-item w-[160px] h-[100px] border rounded-sm"
                                />
                            )}
                        </div>
                    })}
                    {
                        imageFiles?.length > 5 &&
                        <div className='relative'>
                            <div className='absolute top-0 left-0 right-0 bottom-0 m-auto h-full w-full flex items-center justify-center bg-[#00000066] cursor-pointer' onClick={() => handleOpenLightbox(0, imageFiles)}>
                                <h4 className='text-white font-[600] text-2xl'>+{imageFiles?.length - 5}</h4>
                            </div>
                            <CustomImageTag src={imageFiles[5]} alt={imageFiles[5].name} className='w-[160px] h-[100px]' />
                        </div>
                    }
                </div>
            </>

        );
    };

    const renderNonImageFiles = (allFiles, imageFiles) => {
        const downloadFile = (fileUrl, fileName) => {
            var fileDownload = require('js-file-download');
            fileDownload(fileUrl, fileName);
        };

        // Ensure files is an array
        if (!Array.isArray(allFiles)) {
            console.error('Files is not an array:', allFiles);
            return null;
        }

        // Filter out empty objects and files that are in imageFiles
        const validFiles = allFiles.filter(file =>
            file &&
            Object.keys(file).length > 0 &&
            file.file &&
            file.file_name &&
            !imageFiles.includes(file)
        );

        return validFiles.length > 0 ? validFiles.map((file, index) => (
            file.file_type === 'video/mp4' ? (
                <div key={index} className="file-item py-2 flex items-center flex-col gap-1 mb-1">
                    <video controls className='w-[310px] rounded-sm'>
                        <source src={file.file} type="video/mp4" />
                        {t("yourBrowserDoesNotSupport")}
                    </video>
                    <span className="file-info px-2 text-[14px] sm:text-[16px]">{file.file_name}</span>
                </div>
            ) : (
                <button key={index} className="file-item p-2 flex items-center gap-1" onClick={() => downloadFile(file.file, file.file_name)}>
                    <div className="file-info text-[14px] sm:text-[16px]">
                        {file.file_name}
                    </div>
                    <span className="download-button">
                        <IoMdDownload />
                    </span>
                </button>
            )
        )) : null;
    };

    const formatTimeDifference = (timestamp) => {

        const now = moment();
        const messageTime = moment(timestamp);
        const diffInSeconds = now.diff(messageTime, 'seconds');
        const diffInHours = now.diff(messageTime, 'hours');

        if (diffInSeconds < 1) {
            return `1s ${t("ago")}`;
        } else if (diffInSeconds < 60) {
            return `${diffInSeconds}s ${t("ago")}`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)}m ${t("ago")}`;
        } else if (diffInHours < 12) {
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        } else if (diffInHours < 24 && now.isSame(messageTime, 'day')) {
            return `${t("todayAt")} ${messageTime.format('h:mm A')}`;
        } else if (diffInHours < 48 && now.isSame(messageTime.add(1, 'day'), 'day')) {
            return `${t("yesterdayAt")} ${messageTime.format('h:mm A')}`;
        } else {
            return messageTime.format('MM/DD/YYYY');
        }
    };

    const handleAdminChat = () => {
        setIsAdmin(true)
        setSelectedChatTab(null)
    }

    const appendNewChat = (newChat) => {
        setChatList(prevChatList => {

            // Find an existing chat that matches the new chat by booking_id or partner_id
            const existingChatIndex = prevChatList.findIndex(chat => {

                const matchesBookingId = chat.booking_id === newChat.booking_id && newChat.booking_id !== null;
                const matchesPartnerId = chat.partner_id === newChat.partner_id && newChat.booking_id === null;
                return matchesBookingId || matchesPartnerId;
            });

            // If a matching chat is found, select it and return the list unchanged
            if (existingChatIndex !== -1) {
                setSelectedChatTab(prevChatList[existingChatIndex]);
                return prevChatList;
            }

            // If no matching chat is found, append the new chat at the top of the list and select it
            setSelectedChatTab(newChat); // Select the new chat
            return [newChat, ...prevChatList];
        });
    };

    useEffect(() => {

    }, [chatList, newStoredChat, selectedChatTab]);

    const handleSend = async () => {
        if (message.trim() === '' && attachedFiles.length === 0) {
            toast.error(t("pleaseEnterMessageOrAttachFile"));
            return;
        }

        setIsSending(true);

        const newMessage = {
            message: message,
            file: attachedFiles.map(file => ({
                file: URL.createObjectURL(file),
                file_name: file.name,
                file_type: file.type
            })),
            sender_details: { id: userData?.id },
            sender_id: userData?.id
        };

        try {
            const response = await send_chat_message({
                receiver_id: selectedChatTab?.partner_id,
                booking_id: selectedChatTab?.booking_id ? selectedChatTab?.booking_id : null,
                receiver_type: isAdmin ? "0" : "1",
                message: message,
                attachment: attachedFiles,
            });

            // Update chat messages
            setChatMessages(prevMessages => [newMessage, ...prevMessages]);
            setMessage('');
            setAttachedFiles([]);
            scrollToBottom();
            if (newStoredChat) {
                if (newStoredChat.booking_id !== null || selectedChatTab?.booking_id !== null) {
                    // If either has a booking_id, compare booking_ids
                    if (newStoredChat.booking_id === selectedChatTab?.booking_id) {
                        // Update the chat list and select the new chat
                        appendNewChat(newStoredChat);
                    } else {
                        getChatData(null);
                    }
                }
                else {
                    // If both booking_ids are null, compare partner_ids
                    if (newStoredChat.partner_id === selectedChatTab?.partner_id) {
                        // Update the chat list and select the new chat
                        appendNewChat(newStoredChat);
                    } else {
                        getChatData(null);
                    }
                }
            }

        } catch (error) {
            console.log('error', error);
            toast.error(t('failedToSendMessage'));
        } finally {
            setIsSending(false);
        }
    };

    const scrollToBottom = () => {
        const chatScreen = document.querySelector('.chat_messages_screen');
        if (chatScreen) {
            chatScreen.scrollTop = chatScreen.scrollHeight;
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    return (
        <Layout>
            <BreadCrumb firstEle={t("chats")} firstEleLink="/chats" isMobile={isMobile} />

            <section className='container mb-20'>
                {
                    isInitialLoading ?
                        <div className='flex flex-col md:flex-row mx-auto mt-20 rounded-lg gap-1'>
                            <div className='w-full md:w-1/4 bg-white overflow-auto'>
                                <Skeleton className='w-full h-[400px] md:h-[650px]' />
                            </div>
                            <div className='flex-1 flex flex-col'>
                                <Skeleton className='w-full h-[400px] md:h-[650px]' />
                            </div>
                        </div>
                        :
                        <div className='flex flex-col md:flex-row border mx-auto mt-20 rounded-lg'>
                            {chatList.length > 0 &&
                                <ChatList isAdmin={isAdmin} chatListRef={chatListRef} handleChatListScroll={handleChatListScroll} chatList={chatList} handleAdminChat={handleAdminChat} selectedChatTab={selectedChatTab} handleChangeTab={handleChangeTab} isLoadingMore={isLoadingMore} />
                            }

                            {
                                isAdmin ?
                                    <AdminChat isLoading={isLoading} handleScroll={handleScroll} chatMessages={chatMessages} attachedFiles={attachedFiles} handleFileAttachment={handleFileAttachment} message={message} handleMessageChange={handleMessageChange} MaxCharactersInTextMessage={MaxCharactersInTextMessage}
                                        handleSend={handleSend} isSending={isSending} userData={userData} renderMessage={renderMessage} renderFilePreview={renderFilePreview}
                                    />
                                    :
                                    <ProviderChat isLoading={isLoading} handleScroll={handleScroll} chatMessages={chatMessages} attachedFiles={attachedFiles} handleFileAttachment={handleFileAttachment} message={message} handleMessageChange={handleMessageChange} MaxCharactersInTextMessage={MaxCharactersInTextMessage}
                                        handleSend={handleSend} isSending={isSending} userData={userData} renderMessage={renderMessage} selectedChatTab={selectedChatTab} renderFilePreview={renderFilePreview} chatList={chatList}
                                    />
                            }

                        </div>
                }

                {isLightboxOpen && (
                    <Lightbox
                        isLightboxOpen={isLightboxOpen}
                        images={currentImages} // Pass all images to the Lightbox
                        initialIndex={currentImageIndex} // Start at the clicked image
                        onClose={handleCloseLightbox} // Close handler
                    />
                )}
            </section>
        </Layout>
    )
}

export default withAuth(ChatPage)