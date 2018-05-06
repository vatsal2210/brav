module.exports = {

  attributes: {
    email:{
      type:'string',
      unique:'true'
    },
    otp:{
      type:'string'
    },
    data:'json',
  }
};

