import { useState } from 'react';
import { Avatar as AvatarAntd, Upload, message } from 'antd';
import { CameraTwoTone } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ImgCrop from 'antd-img-crop';
import defaultAvatar from '../../assets/images/profile-img.png';
import { useTranslation } from 'react-i18next';

const IconStyle = styled(CameraTwoTone)`
  position: absolute;
  font-size: ${(props) => props.size};
  bottom: 0;
  right: 0;
  opacity: 80%;
`;

const ProfilePicture = styled.div`
  position: relative;
  width: max-content;
`;
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
const Avatar = ({ imgSrc, imgSize, onUpload, ...rest }) => {
  const [imgURL, setImgURL] = useState(imgSrc);
  const { t } = useTranslation();
  const handlePreview = async (file) => {
    const imgPreview = await getBase64(file.originFileObj);
    setImgURL(imgPreview);
  };
  const beforeCrop = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error(t('validation.maximum_image_size', 'Image must smaller than 10MB!'));
    }
    return isLt10M;
  };
  const props = {
    name: 'file',
    listType: 'picture',
    multiple: false,
    showUploadList: false,
    customRequest: onUpload,
    onChange(info) {
      handlePreview(info.file);
      if (info.file.status === 'uploading') {
        console.log('Uploading');
      }
      if (info.file.status === 'done') {
        message.success(t('notification.file_upload_success', 'File uploaded successfully'));
      } else if (info.file.status === 'error') {
        message.error(t('notification.file_upload_failed', 'File upload failed'));
      }
    },
  };
  return (
    <ProfilePicture {...rest}>
      <ImgCrop rotate beforeCrop={beforeCrop}>
        <Upload {...props}>
          <AvatarAntd src={imgURL || defaultAvatar} size={imgSize || 0} />
          <IconStyle size={`${imgSize / 4}px`} />
        </Upload>
      </ImgCrop>
    </ProfilePicture>
  );
};

Avatar.propTypes = {
  imgSrc: PropTypes.string,
  imgSize: PropTypes.number,
};

Avatar.defaultProps = {
  imgSrc: '',
  imgSize: 144,
};

export default Avatar;
