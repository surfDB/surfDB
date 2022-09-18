export const getAccessConditions = (
  condition: number,
  address: string,
  chain: string
) => {
  switch (condition) {
    case 0:
      return [
        {
          conditionType: 'evmBasic',
          contractAddress: '',
          standardContractType: '',
          chain: 'polygon',
          method: '',
          parameters: [':userAddress'],
          returnValueTest: {
            comparator: '=',
            value: address,
          },
        },
      ];
    default:
      return [];
  }
};
