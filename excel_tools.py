# coding=utf-8
from models import Question


def reverse_dict(*iterables):
    d = dict(*iterables)
    return dict([(value, key) for key, value in d.items()])


type_mapping = reverse_dict(Question.TYPE_CHOICE)


def validate_rows(rows):
    def get_value(cell):
        if not cell.value:
            return None
        if hasattr(cell.value, 'strip'):
            return cell.value.strip()
        return cell.value

    seen = {}
    missing = []
    duplications = {}
    validated = []
    invalid_type = []
    invalid_correct_option = []

    def _check_missing(row, i):
        # 前三格必须有内容，4到9列至少有一格包含答案
        valid = all(map(get_value, row[0:3])) and any(map(get_value, row[3:9]))
        if not valid:
            missing.append(i)
        return valid

    def _check_type(row, i):
        valid = row[1].value in type_mapping
        if not valid:
            invalid_type.append(i)
        return valid

    def _check_correct_option(row, i):
        t = type_mapping[row[1].value]
        correct_option = row[2].value
        length = len(correct_option)
        if (t != Question.MULTI and length > 1) \
                or length > 6 \
                or not correct_option.isalpha():
            invalid_correct_option.append(i)
            return False
        if t != Question.MULTI:
            correct_option = [correct_option]
        for option in correct_option:
            cell = row[2 + ord(option.upper()) - 64]
            if not (cell and cell.value):
                invalid_correct_option.append(i)
                return False
        return True

    def _check_duplication(row, i):
        key = row[0].value
        if key in seen:
            duplications.setdefault(key, [])
            duplications[key].append(i)
            return False
        seen[key] = i
        return True

    def _convert_row(row):
        row_fields = ('content', 'type', 'correct_option', 'option_A', 'option_B',
                      'option_C', 'option_D', 'option_E', 'option_F')
        row_values = map(get_value, row)
        row_values[1] = type_mapping[row_values[1]]
        row_values[2] = u','.join([str(ord(c.upper()) - 64) for c in row_values[2]])
        return dict(zip(row_fields, row_values))

    for i, row in enumerate(rows, start=2):
        if _check_missing(row, i) \
                and _check_duplication(row, i) \
                and _check_type(row, i) \
                and _check_correct_option(row, i):
            validated.append(_convert_row(row))

    error_info = {
        'seen': seen,
        'missing': missing,
        'duplications': duplications,
        'invalid_type': invalid_type,
        'invalid_correct_option': invalid_correct_option
    }
    return validated, error_info
