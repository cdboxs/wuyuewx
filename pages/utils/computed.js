function getScroolH(element,callback){
  //计算scroll自动高度
  var query = wx.createSelectorQuery()
  query.select(element).boundingClientRect()
  return query
};

module.exports={
  getScroolH: getScroolH
}
