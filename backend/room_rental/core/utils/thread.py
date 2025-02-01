from collections.abc import Callable
from threading import Thread


def run_in_thread(function: Callable):
    thread = Thread(target=function)
    thread.start()

    return thread
