import api from './api';

const getActiveAuctions = async () => {
  const response = await api.get('/auction');
  return response.data;
};

const getAuctionById = async (id) => {
  const response = await api.get(`/auction/${id}`);
  return response.data;
};

const createAuction = async (auctionData) => {
  const response = await api.post('/auction', auctionData);
  return response.data;
};

const placeBid = async (bidData) => {
  const response = await api.post('/auction/bid', bidData);
  return response.data;
};

const getMyAuctions = async () => {
  const response = await api.get('/auction/my-auctions');
  console.log(response.data);
  return response.data;
};

const getMyBids = async () => {
  const response = await api.get('/auction/my-bids');
  console.log(response.data);
  return response.data;
};

const getUserBalance = async () => {
  const response = await api.get('/user/balance');
  return response.data.balance;
};

export default {
  getActiveAuctions,
  getAuctionById,
  createAuction,
  placeBid,
  getMyAuctions,
  getMyBids,
  getUserBalance
};