import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';

import { Table } from 'components/Table';
import { Header, Text, SubTitle } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import backIcon from 'assets/images/arrow-icon.svg';

const BackButton = styled.button`
  background-color: transparent;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 8px;
    background: transparent center / contain no-repeat url('${backIcon}');
    transform: rotate(90deg);
    margin-right: 25.5px;
  }
`;

const Info = styled.div`
  margin: 33px 0 36px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-row-gap: 23px;

  .x-small {
    margin-bottom: 7px;
    color: ${colors.grayScaleSubText};
  }

  ${media.md`
    grid-template-columns: 1fr 1fr;
  `};
`;

const StyledTable = styled(Table)`
  margin-top: 18px;

  tr > td:first-child {
    color: ${colors.tertiaryBase};
  }
`;

const columns = [
  {
    title: 'Bidder',
    dataIndex: 'key',
    width: '36.88%',
  },
  {
    title: 'Amount (ICX)',
    dataIndex: 'amount',
    width: '24.38%',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    width: '38.74%',
  },
];
const dataSource = [
  {
    key: '0x003F...C6cf',
    amount: '200',
    time: '50min ago',
  },
  {
    key: '0x003F...C6cf1',
    amount: '200',
    time: '50min ago',
  },
  {
    key: '0x003F...C6cf2',
    amount: '200',
    time: '50min ago',
  },
  {
    key: '0x003F...C6cf3',
    amount: '200',
    time: '50min ago',
  },
  {
    key: '0x003F...C6cf4',
    amount: '200',
    time: '50min ago',
  },
];

export const Details = () => {
  const { goBack } = useHistory();
  return (
    <>
      <BackButton type="button" onClick={goBack}>
        <Header className="medium bold">DOT 100</Header>
      </BackButton>
      <Info>
        <div>
          <Text className="x-small">Created date</Text>
          <Text className="medium">07/03/2021</Text>
        </div>
        <div>
          <Text className="x-small">Expiration date</Text>
          <Text className="medium">07/03/2021</Text>
        </div>
        <div>
          <Text className="x-small">Available bid amount</Text>
          <Text className="medium">200 ICX</Text>
        </div>
        <div>
          <Text className="x-small">Current highest bid</Text>
          <Text className="medium">210 ICX</Text>
        </div>
        <div>
          <Text className="x-small">Next accepted bid</Text>
          <Text className="medium">07/03/2021</Text>
        </div>
        <div>
          <Text className="x-small">Top bidder</Text>
          <Text className="medium">0x003F...C6cf</Text>
        </div>
      </Info>

      <SubTitle className="medium bold">Bid history</SubTitle>
      <StyledTable
        columns={columns}
        dataSource={dataSource}
        headerColor={colors.grayAccent}
        backgroundColor={colors.darkBG}
        bodyText={'md'}
        pagination
      />
    </>
  );
};
