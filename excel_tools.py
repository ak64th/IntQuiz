# coding=utf-8
from models import Question


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

    def reverse_dict(*iterables):
        d = dict(*iterables)
        return dict([(value, key) for key, value in d.items()])

    type_mapping = reverse_dict(Question.TYPE_CHOICE)

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
        if t != Question.MULTI and length > 1 or length > 6:
            invalid_correct_option.append(i)
            return False
        elif len(correct_option) > 6:
            pass
        else:
            pass


    def _check_duplication(row, i):
        key = row[0].value
        if key in seen:
            duplications.setdefault(key, [])
            duplications[key].append(i)
            return False
        seen[key] = i
        return True

    for i, row in enumerate(rows, start=2):
        if _check_missing(row, i) and _check_duplication(row, i):
            validated.append(row)

    error_info = {'seen': seen, 'missing': missing, 'duplications': duplications}
    return validated, error_info
