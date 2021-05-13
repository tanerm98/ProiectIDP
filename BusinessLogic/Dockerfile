FROM python:3.6
COPY requirements.txt /tmp
RUN pip3 install -U setuptools
RUN pip3 install -r /tmp/requirements.txt
RUN pip3 install -U pip google-api-python-client
COPY /src /app
WORKDIR /app

EXPOSE 5001
CMD ["python3", "app.py"]