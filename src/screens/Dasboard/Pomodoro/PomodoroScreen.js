import React from 'react';
import { View,Text, Vibration,Modal,Pressable,Button,ScrollView} from 'react-native';
import {strings,setI18Config} from '../../../translations/translations'
import {formatTime} from '../../../components/Helpers/helpers';
import FlexLayout from '../../../components/Layouts/FlexLayout';
import ControlsButton from '../../../components/Buttons/ControlsButton';
import ChangeTypeButton from '../../../components/Buttons/ChangeTypeButton';
import linkButton from '../../../components/Buttons/LinkButton';
import styles from './style';
import InLineLayout from '../../../components/Layouts/InLineLayout';
import sharedStyles from '../../../styles/shared';
import HeaderBar from '../../../components/Header/HeaderBar';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { Touchable } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { TextInput } from 'react-native';

const timeValue = [15,25,45,60];
const defaultProps = {
    types: [
        {name: 'Pomodoro', time: 600},
        {name: 'Short Break', time: 1},
        {name: 'Long Break', time: 2},
    ],
    statuses: [
        {name: 'Playing'},
        {name: 'Paused'},
        {name: 'Finished'},
    ],
}
export default class PomodoroScreen extends React.Component {
    constructor(props) {
      super(props);
      setI18Config();
      this.state = {
          type: defaultProps.types[0],
          time: defaultProps.types[0].time,
          playing: false,
          status: null, 
          interval:null,
          countInterval:0,
          autoBreak:false,
          autoPomodoro:false,
          autoLongBreakInterval:4,
          settingsVisible:false,
      }
    }  

    componentWillUnmount = () => {
        this.setState({countInterval: 100})
    }

    setSettingsVisible = (visible) => {
        this.setState({settingsVisible: visible})
    }


    handlePomodoroTime = (value) => {
        
        this.setState({
            time:value,
            interval:null,
            playing:false,

        }),
        defaultProps.types[0].time = value 
        this.resetTimer()
    }

    //
    handleType = type => { 
        this.stopTimer();
        this.setState({ type: type, time: type.time, playing:false, status: null});
    }

    //
    handlePomodoro = () => {
        this.stopTimer() 
        Vibration.vibrate(100,100,100)
        if(this.state.type === defaultProps.types[0]) {
            this.handleCountInterval()
            if((this.state.countInterval % this.state.autoLongBreakInterval) === 0) this.handleType(defaultProps.types[2]);
            else this.handleType(defaultProps.types[1]);
            this.state.autoBreak ? this.startTimer() : this.setState({status:defaultProps.statuses[2].name})
        } else {
            this.handleType(defaultProps.types[0])
            this.state.autoPomodoro ? this.startTimer() : this.setState({status:null})

        }
    }

    //
    handleCountInterval = () =>{
        this.setState(({ countInterval: ++this.state.countInterval}))    
    }

    //DONE
    timer = () => {
        this.state.time < 1 ? this.handlePomodoro() : this.setState(prevState => ({ time: --prevState.time}))
    }

    //DONE
    startTimer = () => { 
        this.setState ({
            status: defaultProps.statuses[0].name,
            playing: true,
            interval: setInterval(this.timer,1000),
        })
    }

    //work well but only when timer is playing, failed when timer is paused
    stopTimer = () => {
        clearInterval(this.state.interval)
        this.setState({
            interval:null,
        })
    };

    //
    resetTimer = () => {
        this.stopTimer()
        this.setState({
            time: this.state.type.time,
            playing:false,
            status:null,
            countInterval:0,
        })

    }

    //Do poprawy wydajnośc tego rozwiazania
    skipTimer = () => {
        this.handlePomodoro()
    }
 
    //DONE
    pauseTimer = () => { 
        if (this.state.playing){
            this.stopTimer() 
            this.setState({
                status:defaultProps.statuses[1].name,
                playing: false,
            })
        }else {
            this.startTimer()
        }
    }

    progressValue = () => {
        const current = this.state.currentTime
        const totalTime = this.state.type.time
        return ((totalTime - current) / totalTime) * 100;
    }

    render() {
      return (
        <FlexLayout style={sharedStyles.wrapperFlexSpaceBetween} >
            <HeaderBar screenName='Pomodoro Timer' rightIcon = 'settings' rightFunc = {() => this.setSettingsVisible(!this.state.settingsVisible)} />
            <View>
                <Text>Dodaj zadanie</Text>
            </View>
            <View style = {sharedStyles.wrapperFlexCenter}>
                <View style={styles.timer}>
                    <Text>Pomodoro Timer!</Text>
                    <Text>{this.state.type.name}</Text>

                    <Pressable
                    onPress={() => this.setSettingsVisible(!this.state.settingsVisible)}>
                        <Text style={styles.timerValue}>{formatTime(this.state.time)} </Text>
                    </Pressable>

                    <Text>{strings("timerIntervalRound")}{ this.state.type === defaultProps.types[0] ? this.state.countInterval + 1 : this.state.countInterval}</Text>
                </View>
                <ControlsButton
                start = {this.startTimer}
                pause= {this.pauseTimer}
                skip = {this.skipTimer}
                status = {this.state.status}>    
                </ControlsButton>
            </View>

            <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.settingsVisible}
            onRequestClose={() => {this.setSettingsVisible(!this.state.settingsVisible);}}>
                <ScrollView contentContainerStyle={[sharedStyles.wrapperFlexStart,styles.settingsModal]}>
                    <HeaderBar screenName='Pomodoro Settings' style={sharedStyles.marginBottom25} rightIcon='close' rightFunc={() => this.setSettingsVisible(!this.state.settingsVisible)} />
                    <View style={sharedStyles.marginSide25}>
                    
                        <TouchableOpacity style={{paddingTop:15}}>
                            <InLineLayout style={styles.box}>
                                 <Text>Focus</Text>
                                <View style={sharedStyles.wrapperInLine}>
                                    <Text>{(defaultProps.types[0].time)/60} min</Text>
                                    <Icon type='material' name='arrow-drop-down' />
                                </View>
                            </InLineLayout>
                        </TouchableOpacity>

                        <TouchableOpacity style={{paddingTop:15}}>  
                            <InLineLayout style={styles.box}>
                                 <Text>Short Break</Text>
                                <View style={sharedStyles.wrapperInLine}>
                                    <Text>{(defaultProps.types[1].time)/60} min</Text>
                                    <Icon type='material' name='arrow-drop-down' />
                                </View>
                            </InLineLayout>
                        </TouchableOpacity>

                        <TouchableOpacity style={{paddingTop:15}}>
                            <InLineLayout style={styles.box}>
                                 <Text>Long Break</Text>
                                <View style={sharedStyles.wrapperInLine}>
                                    <Text>{(defaultProps.types[2].time)/60} min</Text>
                                    <Icon type='material' name='arrow-drop-down' />
                                </View>
                            </InLineLayout>
                        </TouchableOpacity>

                        <TouchableOpacity style={{paddingTop:15}}>
                            <InLineLayout style={styles.box}>
                                 <Text>Long Break Intervals</Text>
                                <View style={sharedStyles.wrapperInLine}>
                                    <Text>{this.state.autoLongBreakInterval}</Text>
                                    <Icon type='material' name='arrow-drop-down' />
                                </View>
                            </InLineLayout>
                        </TouchableOpacity>

                        <TouchableOpacity style={{paddingTop:15}}>
                            <InLineLayout style={styles.box}>
                                 <Text>Auto Start Breaks?</Text>
                                 <Text>{this.state.autoBreak.toString()}</Text>
                            </InLineLayout>
                        </TouchableOpacity>

                        <TouchableOpacity style={{paddingTop:15}}>
                            <InLineLayout style={styles.box}>
                                 <Text>Auto Start Pomodoro?</Text>
                                    <Text>{this.state.autoPomodoro.toString()}</Text>
                            </InLineLayout>
                        </TouchableOpacity>

                        <InLineLayout style={{paddingTop:15}}>
                            <TouchableOpacity style = {{borderRadius:50,borderColor:'black',height:60, width:60, borderWidth:1, justifyContent:'center'}}>
                                <Icon type='material' name='notifications'/>
                            </TouchableOpacity>
                            <TouchableOpacity style = {{borderRadius:50,borderColor:'black',height:60, width:60, borderWidth:1, justifyContent:'center'}}>
                                <Icon type='material' name='cloud'/>
                            </TouchableOpacity>
                            <TouchableOpacity style = {{borderRadius:50,borderColor:'black',height:60, width:60, borderWidth:1, justifyContent:'center'}}>
                                <Icon name='rain'/>
                            </TouchableOpacity>
                            <TouchableOpacity style = {{borderRadius:50,borderColor:'black',height:60, width:60, borderWidth:1, justifyContent:'center'}}>
                                <Icon type='material' name='train'/>
                            </TouchableOpacity>
                        </InLineLayout>
                    </View>
                </ScrollView>
            </Modal>
        </FlexLayout>
      );
    }
  }
