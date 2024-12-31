export const useValidation = (title: string, maxLength: number) => {
  const isError = (value: string) => {
    return value.length > maxLength;
  };

  const getHelperText = (value: string) => {
    if (!isError(value)) return null;
    return isError(value)
      ? `${title}は${maxLength}字以内で入力してください。`
      : null;
  };

  const getLabel = (value: string) => {
    return `${title} (${value.length}/${maxLength})`;
  };

  const getTitle = () => {
    return title;
  };

  return {
    error: isError,
    helperText: getHelperText,
    label: getLabel,
    title: getTitle,
  };
};
