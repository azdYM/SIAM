
export function getThreeMiddleElements<T>(arr: T[]) {
    const length = arr.length;

    if (length < 3) {
        return arr;
    }

    const middleIndex = Math.floor(length / 2);
    return arr.slice(middleIndex - 1, middleIndex + 2);
}